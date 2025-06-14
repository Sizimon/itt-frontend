import RecentlyViewed from './RecentlyViewed';

export default function DashboardHeader({ user }: { user: any }) {
    return (
        <div className="flex flex-col justify-center items-center text-center w-full">
            <h1 className='text-4xl md:text-6xl'>In<span className='text-amber-600'>Time</span>Tasks</h1>
            <h1 className="text-lg md:text-3xl font-bold md:my-4">WELCOME BACK, <span className='text-amber-600'>{user?.username}</span></h1>
            <RecentlyViewed />
        </div>
    )
} 