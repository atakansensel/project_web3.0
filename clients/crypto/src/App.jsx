import { Navbar,Footer,Services,Transaction,Welcome } from "./components"

const App = () => {
return (
    <div className="min-h-screen">
     <div className="gradient-bg-welcome">
     <Navbar></Navbar>
     <Welcome></Welcome>
     </div>
     <Services></Services>
     <Transaction></Transaction>
     <Footer></Footer>
    </div>
  )
}

export default App
