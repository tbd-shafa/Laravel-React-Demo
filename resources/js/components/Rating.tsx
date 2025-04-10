import React, { SVGProps, useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const ratingVariants = {
    default: {
        star: 'text-foreground',
        emptyStar: 'text-muted-foreground',
    },
    destructive: {
        star: 'text-red-500',
        emptyStar: 'text-red-200',
    },
    yellow: {
        star: 'text-yellow-500',
        emptyStar: 'text-yellow-200',
    },
};

interface RatingsProps extends React.HTMLAttributes<HTMLDivElement> {
    rating: number;
    totalStars?: number;
    size?: number;
    fill?: boolean;
    Icon?: React.ReactElement<SVGProps<SVGSVGElement>>;
    variant?: keyof typeof ratingVariants;
    onRatingChange?: (value: number) => void;
    readOnly?: boolean;
}

const Ratings = ({ ...props }: RatingsProps) => {
    const {
        rating,
        totalStars = 5,
        size = 20,
        fill = true,
        Icon = <Star />,
        variant = 'default',
        onRatingChange,
        readOnly = false,
    } = props;

    const [hovered, setHovered] = useState<number | null>(null);

    const handleClick = (index: number) => {
        if (!readOnly && onRatingChange) onRatingChange(index + 1);
    };

    return (
        <div className={cn('flex items-center gap-1')} {...props}>
            {[...Array(totalStars)].map((_, i) => {
                const isFilled = hovered !== null ? i <= hovered : i < Math.round(rating);
                return (
                    <span
                        key={i}
                        className="cursor-pointer"
                        onMouseEnter={() => !readOnly && setHovered(i)}
                        onMouseLeave={() => !readOnly && setHovered(null)}
                        onClick={() => handleClick(i)}
                    >
                        {React.cloneElement(Icon, {
                            size,
                            className: cn(
                                fill ? 'fill-current' : 'fill-transparent',
                                isFilled ? ratingVariants[variant].star : ratingVariants[variant].emptyStar
                            ),
                        })}
                    </span>
                );
            })}
        </div>
    );
};

export { Ratings };
