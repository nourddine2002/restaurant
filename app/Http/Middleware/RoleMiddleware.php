<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string  $role  The required role
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $role) : Response
    {
        Log::info('User Role:', ['user_role' => Auth::user()->role, 'required_role' => $role]);

        // Check if user is logged in
        if (!Auth::check()) {
            return redirect('/login');
        }
        Log::info('User Role:', [
            'user_id' => Auth::user()->id,
            'user_name' => Auth::user()->name,
            'user_role' => Auth::user()->role,
        ]);
    
        
        // Check if user has the required role
        if (!$this->checkRole(Auth::user(), $role)) {
            abort(403, 'Unauthorized action. You do not have the required permissions.');
        }
        
        return $next($request);
    }
    
    /**
     * Check if the user has the required role.
     *
     * @param  \App\Models\User  $user
     * @param  string  $role
     * @return bool
     */
    protected function checkRole($user, $role)
    {
        // If multiple roles are passed (comma-separated)
        if (strpos($role, ',') !== false) {
            $roles = explode(',', $role);
            foreach ($roles as $r) {
                if ($user->hasRole(trim($r))) {
                    return true;
                }
            }
            return false;
        }
        
        // Single role check
        return $user->hasRole($role);
    }
}