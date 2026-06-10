<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $users = User::when($request->search, fn($q) =>
                $q->where('name', 'ilike', '%' . $request->search . '%')
                  ->orWhere('email', 'ilike', '%' . $request->search . '%'))
            ->latest()
            ->paginate($request->per_page ?? 20);
        return response()->json($users);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:users'],
            'password' => ['required', 'string', 'min:8'],
            'role'     => ['required', 'in:super_admin,admin,staff,editor,agent'],
        ]);
        $validated['password'] = Hash::make($validated['password']);
        $validated['is_active'] = true;
        return response()->json(['data' => User::create($validated)], 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        if ($user->id === auth()->id() && isset($request->role) && $request->role !== $user->role) {
            return response()->json(['message' => 'You cannot change your own role.'], 403);
        }

        $validated = $request->validate([
            'name'      => ['string', 'max:255'],
            'email'     => ['email', 'unique:users,email,' . $id],
            'password'  => ['nullable', 'string', 'min:8'],
            'role'      => ['in:super_admin,admin,staff,editor,agent'],
            'is_active' => ['boolean'],
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $user->update($validated);
        return response()->json(['data' => $user]);
    }

    public function destroy(int $id): JsonResponse
    {
        if ($id === auth()->id()) {
            return response()->json(['message' => 'You cannot delete your own account.'], 403);
        }
        User::findOrFail($id)->delete();
        return response()->json(['message' => 'User deleted.']);
    }
}
