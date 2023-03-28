export default function SkeletonText({className=''}) {
    return (
        <div role="status" className="flex items-center justify-center justify-items-center content-center space-y-8 animate-pulse">
            <div className={`bg-gray-200 dark:bg-gray-700 ${className}`}></div>
            </div>
    )
}
