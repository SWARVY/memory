import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router';

export default function PostPagination({
  continueCursor,
  isDone,
}: {
  continueCursor: string | null;
  isDone: boolean;
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const cursor = searchParams.get('cursor');
  const prevCursors = useMemo(
    () => searchParams.get('prevCursors')?.split(',').filter(Boolean) ?? [],
    [searchParams],
  );

  const handleNext = (continueCursor: string | null) => {
    if (!continueCursor) return;
    const newPrevCursors = [...prevCursors, cursor ?? ''];
    setSearchParams({
      cursor: continueCursor,
      prevCursors: newPrevCursors.filter(Boolean).join(','),
    });
  };

  const handlePrev = () => {
    if (prevCursors.length === 0) return;
    const newPrevCursors = prevCursors.slice(0, -1);
    setSearchParams({
      cursor: prevCursors[prevCursors.length - 1] || '',
      prevCursors: newPrevCursors.join(','),
    });
  };

  return (
    <div className="mt-4 flex w-full justify-between gap-2">
      <PaginationButton
        onClick={() => handlePrev()}
        disabled={prevCursors.length === 0}
      >
        <ChevronLeft />
        PREV
      </PaginationButton>
      <PaginationButton
        onClick={() => handleNext(continueCursor)}
        disabled={isDone}
      >
        NEXT
        <ChevronRight />
      </PaginationButton>
    </div>
  );
}

function PaginationButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-x-2 disabled:opacity-50"
    >
      {children}
    </button>
  );
}
