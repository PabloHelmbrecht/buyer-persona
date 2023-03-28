export default function ArrowDownToolTip({ className = '' }) {
    return (
        <div className={className}>
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none" transform="rotate(180)" className={` -ml-1 mr-1 ${className}`}>
                <path d="M50 60 L90 90 H10 Z" stroke="white" stroke-width="10" fill="white" stroke-linejoin="round" />
            </svg>
        </div>
    )
}
