<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Review;
use Illuminate\Support\Facades\DB;

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
            ? Blog::latest()->paginate(5)
            : Blog::where('user_id', $user->id)->latest()->paginate(5);

        return Inertia::render('blogs/index', [
            'blogs' => $blogs,
            'auth' => ['user' => $user],
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
            ? 'Blog Post Become approved successfully'
            : 'Blog Post Become Pending successfully');
    }

    // public function show()
    // {
    //     $blogs = Blog::with('user')->latest()->get();

    //     return Inertia::render('blogs/PublicIndex', [
    //         'blogs' => $blogs,
    //     ]);
    // }

    public function show()
    {
        $blogs = Blog::with('user', 'reviews')
            ->latest()
            ->get()
            ->map(function ($blog) {
                
                $averageRating = $blog->reviews->avg('rating');
                $blog->average_rating = $averageRating;

                return $blog;
            });

        return Inertia::render('blogs/PublicIndex', [
            'blogs' => $blogs,
        ]);
    }

    public function details($id)
    {

        $blog = Blog::with('user', 'reviews.user')->findOrFail($id);
        //dd($blog);
        return Inertia::render('blogs/Show', [
            'blog' => $blog,
        ]);
    }

    public function storeReview(Request $request, $id)
    {

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        $review = Review::where('blog_id', $id)->where('user_id', Auth::id())->first();

        if ($review) {
            return back()->with('error', 'You have already given a review.');
        }

        Review::create([
            'blog_id' => $id,
            'user_id' => Auth::id(),
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return back()->with('success', 'Review submitted successfully!');
    }

    public function updateReview(Request $request, $id)
    {

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|max:1000',
        ]);

        $review = Review::where('blog_id', $id)->where('user_id', Auth::id())->firstOrFail();

        $review->update([
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);

        return back()->with('success', 'Review updated successfully!');
    }
}
