export interface Blog {
    id: number;
    title: string;
    description: string;
    image?: string | null;
    created_at: string;
    updated_at: string;
}

export interface BlogsData {
    total: number;
    data: Blog[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

