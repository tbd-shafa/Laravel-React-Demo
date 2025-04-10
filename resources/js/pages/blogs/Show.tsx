
import { Ratings } from '@/components/Rating';
import { PageProps } from '@/types';
import { Blog } from '@/types/blog';
import { useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { Toaster } from "@/components/ui/sonner"
interface Props extends PageProps {
    blog: Blog & {
        user: { name: string };
        reviews: {
            id: number;
            comment: string;
            rating: number;
            user: { name: string };
        }[];
    };
}
interface FlashMessages {
    success?: string;
    error?: string;
}

export default function Show({ blog }: Props) {
       const { flash } = usePage<{ flash: FlashMessages }>().props;
    const [activeTab, setActiveTab] = useState<'description' | 'review'>('description');
    const { data, setData, post, processing, errors, reset } = useForm({
        rating: '',
        comment: '',
    });
  useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);
    const submitReview = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('blogs.review', blog.id), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };
    
    return (
       
            <div className="mx-auto flex max-w-6xl gap-6 px-4 py-8">
            <Toaster />
            {/* Left Side */}
            <div className="w-2/3">
                <img
                    src={blog.image ? `/storage/${blog.image}` : '/placeholder.jpg'}
                    alt={blog.title}
                    className="mb-4 h-64 w-full rounded object-cover"
                />

                {/* Tabs */}
                <div className="mb-4 flex border-b">
                    <button
                        className={`px-4 py-2 ${activeTab === 'description' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}
                        onClick={() => setActiveTab('description')}
                    >
                        Description
                    </button>
                    <button
                        className={`px-4 py-2 ${activeTab === 'review' ? 'border-b-2 border-blue-600 font-semibold' : ''}`}
                        onClick={() => setActiveTab('review')}
                    >
                        Reviews
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'description' && (
                    <div>
                        <h2 className="mb-2 text-xl font-bold">{blog.title}</h2>
                        <p className="leading-relaxed text-gray-700">{blog.description}</p>
                    </div>
                )}

                {activeTab === 'review' && (
                    <div className="space-y-4">
                        {/* Reviews List */}
                        {blog.reviews.map((review) => (
                            <div key={review.id} className="rounded border p-3">
                                <p className="font-medium">{review.user.name}</p>
                                <p>
                                    <Ratings rating={review.rating} variant="yellow" readOnly />
                                </p>
                                <p>{review.comment}</p>
                            </div>
                        ))}

                        {/* Add New Review (You can wire this to a form with Inertia post later) */}
                        <form onSubmit={submitReview} className="mt-6 space-y-2">
                            
                            <div>
                                <label className="mb-1 block font-medium">Rating</label>
                                <Ratings
                                    rating={parseFloat(data.rating) || 0}
                                    onRatingChange={(val) => setData('rating', val.toString())}
                                    variant="yellow"
                                />
                                {errors.rating && <p className="text-sm text-red-500">{errors.rating}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block font-medium">Comment</label>
                                <textarea
                                    value={data.comment}
                                    onChange={(e) => setData('comment', e.target.value)}
                                    className="block w-full rounded border p-2"
                                />
                                {errors.comment && <p className="text-sm text-red-500">{errors.comment}</p>}
                            </div>

                            <button type="submit" disabled={processing} className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                                Submit Review
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* Right Side Info */}
            <div className="h-fit w-1/3 rounded-lg border bg-white p-4 shadow-sm">
                <h2 className="mb-4 text-xl font-bold">{blog.title}</h2>
                <p>
                    <strong>Status:</strong> {blog.status === 1 ? 'Published' : 'Draft'}
                </p>
                <p>
                    <strong>Author:</strong> {blog.user.name}
                </p>
                <p>
                    <strong>Last Updated:</strong>{' '}
                    {new Date(blog.updated_at).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                    })}
                    ,{' '}
                    {new Date(blog.updated_at)
                        .toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: true,
                        })
                        .toLowerCase()}
                </p>
            </div>
        </div>

        
    );
}
