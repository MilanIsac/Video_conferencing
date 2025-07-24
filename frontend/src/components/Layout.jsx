import Sidebar from './Sidebar.jsx'
import Navbar from './Navbar.jsx'
import { useTheme } from '../store/useTheme.js';

const Layout = ( {children, showSidebar = false} ) => {
  const { theme } = useTheme();
  return (
    <div className='min-h-screen' data-theme={theme}>
      <div className='flex'>
        { showSidebar && <Sidebar /> }
        <div className='flex-1 flex flex-col'>
            <Navbar />
            <main className='flex-1 overflow-y-auto'>{ children }</main>
        </div>
      </div>
    </div>
  )
}

export default Layout
