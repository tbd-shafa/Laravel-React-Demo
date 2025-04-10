export interface Blog {
    id: number;
    title: string;
    description: string;
    image?: string | null;
    created_at: string;
    updated_at: string;
    status:number;
}
export interface Blog {
    id: number;
    title: string;
    description: string;
    image?: string;
    user: { name: string };
    reviews: {
        id: number;
        rating: number;
        comment: string;
        user: { name: string };
    }[];
    average_rating?: number; // Add this line to define the average_rating
}


export interface BlogsData {
    total: number;
    data: Blog[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

