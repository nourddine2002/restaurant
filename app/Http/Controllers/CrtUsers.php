<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class CrtUsers extends Controller
{
    public function index()
    {
        return response()->json(User::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'password' => 'nullable|required|min:6',
            'role' => 'required|string|in:admin,waiter',
        ]);

        $user = User::create([
            'username' => $request->username,
            'password' => Hash::make($request->password),
            'role' => $request->role,
        ]);

        return response()->json($user, 201);
    }

    public function update(Request $request, $id)
    {
        // Find the user by ID
        $user = User::findOrFail($id);

        // Validate the request
        $request->validate([
            'username' => 'required|string|max:255',
            'password' => 'nullable|string|min:6', // Password is optional
            'role' => 'required|string|in:admin,waiter',
        ]);

        // Prepare the data for update
        $data = $request->only(['username', 'role']);
        if ($request->filled('password')) {
            $data['password'] = Hash::make($request->input('password')); // Hash the new password
        }

        // Update the user
        $user->update($data);

        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    public function destroy($id)
    {
        User::findOrFail($id)->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}