<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // return Inertia::render('blogs/index', [
        //     'blogs' => Blog::latest()->paginate(5),
        // ]);

        $user = Auth::user();

        $blogs = $user->role === 1
            ? Blog::latest()->paginate(5) // Admin sees all
            : Blog::where('user_id', $user->id)->latest()->paginate(5); // Regular user
    
        return Inertia::render('blogs/index', [
            'blogs' => $blogs,
            'auth' => ['user' => $user], // in case it's not globally shared
        ]);
    }

    public function create()
    {
        return Inertia::render('blogs/create');
    }




    public function store(Request $request)
    {
        $user = Auth::user();

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('blogs', 'public');
        }
       
        $data['user_id'] = $user->id;
        Blog::create($data);

        return redirect()->route('blogs.index')->with('success', 'Blog created Successfully');
    }

    public function edit(Blog $blog)
    {
        return Inertia::render('blogs/edit', [
            'blog' => $blog,
        ]);
    }



    public function update(Request $request, Blog $blog)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('blogs', 'public');
        }

        $blog->update($data);

        return redirect()->route('blogs.index')->with('success', 'Blog updated Successfully.');
    }


    public function destroy(Blog $blog)
    {
        $blog->delete();
        return redirect()->route('blogs.index')->with('success', 'Blog Deleted Successfully');
    }



    public function updateStatus(Request $request, Blog $blog)
    {
        $request->validate([
            'status' => 'required|in:0,1'
        ]);
        //dd($request->status);
        $blog->update(['status' => $request->status]);

        return back()->with('success', $request->status == 1
            ? 'Blog approved successfully'
            : 'Blog rejected successfully');
    }
}
