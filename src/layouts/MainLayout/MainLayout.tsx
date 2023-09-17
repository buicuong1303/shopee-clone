import Footer from 'src/components/Footer/Footer'
import Header from 'src/components/Header/Header'

interface Props {
  children?: React.ReactNode
}

function MainLayout({ children }: Props) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default MainLayout
