<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index() {
        return response()->json(User::all());
    }

    public function store(Request $request) {
        $request->validate([
            'name' => 'required',
            'password' => 'required|min:6',
            'role' => 'required|string|in:admin,waiter',
        ]);

        // $isFirstUser = User::where('role', 'admin')->count() == 0;
        $user = User::create([
            'name' => $request->name,
            'password' => Hash::make($request->password),
            'role' => $request->role
            // 'role' => $isFirstUser ? 'admin' : 'waiter', // First user is admin, others are waiters
        ]);

        return response()->json($user, 201);
    }

    public function update(Request $request, $id) {
        $user = User::findOrFail($id);
        $user->update($request->only(['username','role']));

        return response()->json($user);
    }

    public function destroy($id) {
        User::findOrFail($id)->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}
