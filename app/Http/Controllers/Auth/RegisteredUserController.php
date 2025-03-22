<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // Validate the request
        $request->validate([
            'username' => ['required', 'string', 'max:255', 'unique:users'], // Validate username
            'password' => ['required', 'confirmed', Rules\Password::defaults()], // Validate password
            'role' => ['required', 'string', 'in:admin,waiter'], // Validate role
        ]);

        // Create the user
        $user = User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'role' => $request->role, // Save the role
        ]);

        // Fire the Registered event
        event(new Registered($user));

        // Log in the user
        Auth::login($user);

        // Redirect to the dashboard
        return redirect(route('dashboard', absolute: false));
    }
}