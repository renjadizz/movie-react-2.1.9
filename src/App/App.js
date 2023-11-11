import { Layout } from 'antd'

const { Header, Footer, Content } = Layout
import styles from './App.module.css'

const App = () => {
  return (
    <Layout className={styles.main}>
      <Header className={styles.header}>header</Header>
      <Layout>
        <Content>main content</Content>
      </Layout>
      <Footer>footer</Footer>
    </Layout>
  )
}

export default App
