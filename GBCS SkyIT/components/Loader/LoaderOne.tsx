import styles from './LoaderOne.module.css';

export const LoaderOne = () => {
    return (
        <div className={styles.loaderOverlay}>
            <div className={styles.loader}></div>
        </div>
    );
}