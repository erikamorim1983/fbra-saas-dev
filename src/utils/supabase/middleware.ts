import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and supabase.auth.getUser(). A
    // simple mistake can make it very hard to debug why your user is being logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const isAuthPage = request.nextUrl.pathname.startsWith('/auth/login') || request.nextUrl.pathname.startsWith('/auth/auth-code-error');
    const isAdminPath = request.nextUrl.pathname.startsWith('/admin');
    const isPortalPath = request.nextUrl.pathname.startsWith('/portal');

    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('status, role')
            .eq('id', user.id)
            .single();

        // 1. Blocked users can't access anything except login
        if (profile?.status === 'blocked' && !isAuthPage) {
            const url = request.nextUrl.clone()
            url.pathname = '/auth/login'
            url.searchParams.set('error', 'Sua conta está suspensa. Entre em contato com o suporte.')
            return NextResponse.redirect(url)
        }

        // 2. Role-based Access Control
        // Clients can NEVER access /admin
        if (profile?.role === 'client' && isAdminPath) {
            const url = request.nextUrl.clone()
            url.pathname = '/portal' // Redirect clients back to their portal
            return NextResponse.redirect(url)
        }

        // Admins and Consultants can access BOTH /admin and /portal (for testing)
        // No restriction needed here for them.
    }

    if (!user && !isAuthPage && (isPortalPath || isAdminPath)) {
        const url = request.nextUrl.clone()
        url.pathname = '/auth/login'
        // If they were trying to access admin, keep the admin type for the login screen
        if (isAdminPath) url.searchParams.set('type', 'admin');
        return NextResponse.redirect(url)
    }


    // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're creating a
    // new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but remember that it needs to depart
    //    from the current response.
    // If you are unsure, just return the supabaseResponse object.

    return supabaseResponse
}
