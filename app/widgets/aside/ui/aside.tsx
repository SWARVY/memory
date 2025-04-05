import { Avatar, AvatarFallback, AvatarImage } from '~/shared/ui/avatar';

export default function Aside() {
  return (
    <aside className="w-full border-gray-200 space-y-2">
      <ProfileSection />
    </aside>
  );
}

function ProfileSection() {
  return (
    <article className="flex flex-col items-center p-4 w-full space-y-4 rounded-lg bg-gray-50">
      <Avatar className="size-56 rounded-lg">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="text-sm text-gray-600 text-center">
        <h2 className="text-xl font-bold mb-2">사용자 이름</h2>
        <p className="text-gray-600">@username</p>
        <p className="text-gray-500">소개글이 들어갈 자리입니다.</p>
      </div>
    </article>
  );
}
