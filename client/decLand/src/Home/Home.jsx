import styles from './App.module.css'
import logo from './logo.svg'

export function Home () {
  return (
    <>
      <header class={styles.header}>
        <img src={logo} class={styles.logo} alt='logo' />
        <p>
          Digitisation of real estate records with <code>Blockchain</code>
        </p>
        <a
          class={styles.link}
          href='https://github.com/kaushikkumarbora/project-8thsem'
          target='_blank'
          rel='noopener noreferrer'
        >
          Checkout the Project
        </a>
      </header>
    </>
  )
}
