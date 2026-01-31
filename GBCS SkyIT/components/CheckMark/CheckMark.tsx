import styles from './CheckMark.module.css'

export const CheckMark = () => {
    return (
        <div className={`${styles.checkmark_animation}`}>
            <svg
                className="w-10 h-10 text-green-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <polyline points="20 6 9 17 4 12" />
            </svg>
        </div>
    )
}