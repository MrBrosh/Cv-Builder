import { useRef } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { FileEdit, FileText, Save, LogOut, Settings } from 'lucide-react'
import { toast } from 'sonner'
import { useCV } from '../../context/CVContext'
import { useAuth } from '../../context/AuthContext'
import { PrintRefContext } from '../../context/PrintRefContext'
import { EditorPage } from '../../pages/EditorPage'
import { PreviewPage } from '../../pages/PreviewPage'
import { Button, DownloadButton } from '../ui'

export function Layout() {
  const { cvData, saveCV, isSaving, isLoading } = useCV()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isAdmin = location.pathname === '/editor/admin'
  const printRef = useRef<HTMLElement | null>(null)

  async function handleSaveCV() {
    try {
      await saveCV(cvData)
      toast.success('CV saved successfully!', {
        description: 'Your CV has been saved to the server.',
      })
    } catch (err) {
      toast.error('Failed to save CV', {
        description: err instanceof Error ? err.message : 'An error occurred while saving.',
      })
    }
  }

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
    toast.success('Logged out')
  }

  const navLinkBase =
    'flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors'
  const navLinkActive = 'bg-primary-500/20 text-primary-300'
  const navLinkInactive = 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'

  return (
    <PrintRefContext.Provider value={printRef}>
    <div className="relative z-10 flex min-h-screen flex-col">
      {/* Top header: title + Save CV */}
      <header className="sticky top-0 z-20 border-b border-primary-500/30 bg-slate-900/80 backdrop-blur-xl shadow-lg shadow-slate-900/50">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6">
          <h1 className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-lg font-bold text-transparent">
            CV Builder AI
          </h1>
          <div className="flex items-center gap-2">
            {/* Desktop: Editor | Preview links in header */}
            <nav className="hidden gap-1 md:flex" aria-label="Main">
              <NavLink
                to="/editor"
                className={({ isActive }) =>
                  [navLinkBase, isActive ? navLinkActive : navLinkInactive].join(' ')
                }
              >
                <FileEdit className="h-4 w-4" />
                Editor
              </NavLink>
              <NavLink
                to="/preview"
                className={({ isActive }) =>
                  [navLinkBase, isActive ? navLinkActive : navLinkInactive].join(' ')
                }
              >
                <FileText className="h-4 w-4" />
                Preview
              </NavLink>
              <NavLink
                to="/editor/admin"
                className={({ isActive }) =>
                  [navLinkBase, isActive ? navLinkActive : navLinkInactive].join(' ')
                }
              >
                <Settings className="h-4 w-4" />
                Admin
              </NavLink>
            </nav>
            <DownloadButton
              contentRef={printRef}
              disabled={isLoading}
              className="gap-2"
            />
            <Button
              type="button"
              variant="primary"
              onClick={handleSaveCV}
              isLoading={isSaving}
              disabled={isSaving}
              className="gap-2"
            >
              <Save className="h-4 w-4" />
              Save CV
            </Button>
            <span className="hidden text-sm text-slate-400 sm:inline">{user?.name}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-1"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1600px] flex-1 p-4 sm:p-6">
        {/* Admin: full-width outlet */}
        {isAdmin ? (
          <Outlet />
        ) : (
        <>
        {/* Desktop (md+): split — scrollable Editor left, sticky Preview right */}
        <div className="hidden md:grid md:grid-cols-[1fr,1fr] lg:grid-cols-[1fr,1fr] md:gap-6 md:items-start">
          <section
            className="min-w-0 rounded-xl border border-primary-500/25 bg-slate-800/40 backdrop-blur-md p-4 shadow-xl shadow-slate-900/50"
            aria-label="Editor"
          >
            <EditorPage />
          </section>
          <aside
            className="sticky top-20 min-h-0 min-w-0 self-start overflow-y-auto rounded-xl border border-primary-500/25 bg-slate-800/40 backdrop-blur-md p-4 shadow-xl shadow-slate-900/50 md:max-h-[calc(100vh-6rem)]"
            aria-label="Preview"
          >
            <PreviewPage />
          </aside>
        </div>

        {/* Mobile: single view, toggle via bottom nav */}
        <div className="md:hidden">
          <Outlet />
          <nav
            className="fixed inset-x-0 bottom-0 z-10 flex border-t border-primary-500/30 bg-slate-900/90 backdrop-blur-xl shadow-lg shadow-slate-900/50"
            aria-label="Mobile navigation"
          >
            <NavLink
              to="/editor"
              className={({ isActive }) =>
                `flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-500/20 text-primary-300' : 'text-slate-400'
                }`
              }
            >
              <FileEdit className="h-5 w-5" />
              Editor
            </NavLink>
            <NavLink
              to="/preview"
              className={({ isActive }) =>
                `flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-500/20 text-primary-300' : 'text-slate-400'
                }`
              }
            >
              <FileText className="h-5 w-5" />
              Preview
            </NavLink>
            <NavLink
              to="/editor/admin"
              className={({ isActive }) =>
                `flex flex-1 items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-500/20 text-primary-300' : 'text-slate-400'
                }`
              }
            >
              <Settings className="h-5 w-5" />
              Admin
            </NavLink>
          </nav>
          {/* Spacer so content isn’t hidden behind fixed bottom nav */}
          <div className="h-16 shrink-0" />
        </div>
        </>
        )}
      </main>
    </div>
    </PrintRefContext.Provider>
  )
}
