import { cn } from '@/lib/utils';

interface PlaceholderImageProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  className?: string;
}

export function PlaceholderImage({ 
  text = 'Image',
  className,
  ...props 
}: PlaceholderImageProps) {
  const initials = text
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div 
      className={cn(
        'flex items-center justify-center rounded-full bg-gray-200 text-gray-500 font-medium',
        className
      )}
      {...props}
    >
      {initials}
    </div>
  );
}
