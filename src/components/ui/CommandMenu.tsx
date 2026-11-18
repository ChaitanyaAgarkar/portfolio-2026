import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import { Command } from 'cmdk';
import { ArrowUpRight, FolderGit2, Moon, Search, Sun, Terminal } from 'lucide-react';
import { COMMAND_ITEMS, SECTION_ROUTE_MAP } from '@/data/navigation';
import { PROJECTS } from '@/data/projects';
import { useUIStore } from '@/stores/uiStore';

export function CommandMenu() {
  const open = useUIStore((s) => s.commandOpen);
  const setOpen = useUIStore((s) => s.setCommandOpen);
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(!open);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, setOpen]);

  const executeSectionJump = (sectionId: string) => {
    setOpen(false);
    if (window.matchMedia('(max-width: 767px)').matches) {
      navigate(SECTION_ROUTE_MAP[sectionId] || '/');
      return;
    }
    if (location.pathname !== '/') {
      navigate(`/#${sectionId}`);
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
      return;
    }
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAction = (actionType: 'section' | 'route' | 'external', target: string) => {
    setOpen(false);
    if (actionType === 'section') {
      executeSectionJump(target);
      return;
    }
    if (actionType === 'route') {
      navigate(target);
      return;
    }
    if (actionType === 'external') {
      window.open(target, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[85] bg-black/35 backdrop-blur-sm" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed top-[16%] left-1/2 z-[86] w-[92vw] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-black/12 bg-white shadow-2xl shadow-black/15"
        >
          <Dialog.Title className="sr-only">Command Interface</Dialog.Title>
          <Command label="Engineering command palette" className="w-full">
            <div className="flex items-center gap-3 border-b border-black/10 px-4 py-3">
              <Search className="h-4 w-4 text-[#164CE0]" aria-hidden="true" />
              <Command.Input
                placeholder="Type a command (e.g. /projects, /experience, /contact)..."
                className="w-full bg-transparent font-mono text-sm text-[#111111] placeholder:text-[#555555] focus:outline-none"
              />
              <kbd className="rounded border border-black/12 bg-[#EEEEEE] px-2 py-0.5 font-mono text-[10px] text-[#444444]">
                ESC
              </kbd>
            </div>

            <Command.List className="max-h-[380px] overflow-y-auto p-2">
              <Command.Empty className="px-4 py-8 text-center font-mono text-xs text-[#555555]">
                No matching command or route found.
              </Command.Empty>

              <Command.Group
                heading="Navigation & Quick Commands"
                className="px-2 py-1.5 font-mono text-[11px] tracking-wider text-[#555555] uppercase"
              >
                {COMMAND_ITEMS.map((item) => (
                  <Command.Item
                    key={item.command}
                    value={`${item.command} ${item.label} ${item.description}`}
                    onSelect={() => handleAction(item.actionType, item.target)}
                    className="mt-1 flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors aria-selected:bg-[#EEEEEE] aria-selected:text-[#111111]"
                  >
                    <div className="flex items-center gap-3">
                      <Terminal className="h-4 w-4 shrink-0 text-[#164CE0]" aria-hidden="true" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-[#164CE0]">
                            {item.command}
                          </span>
                          <span className="text-sm font-medium text-[#111111]">{item.label}</span>
                        </div>
                        <p className="text-xs text-[#555555]">{item.description}</p>
                      </div>
                    </div>
                    {item.actionType === 'external' ? (
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-[#555555]" aria-hidden="true" />
                    ) : null}
                  </Command.Item>
                ))}

                <Command.Item
                  value="/theme toggle dark light mode studio appearance"
                  onSelect={() => {
                    toggleTheme();
                    setOpen(false);
                  }}
                  className="mt-1 flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors aria-selected:bg-[#EEEEEE] aria-selected:text-[#111111]"
                >
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? (
                      <Sun className="h-4 w-4 shrink-0 text-[#FFCC00]" aria-hidden="true" />
                    ) : (
                      <Moon className="h-4 w-4 shrink-0 text-[#164CE0]" aria-hidden="true" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-[#164CE0]">
                          /theme
                        </span>
                        <span className="text-sm font-medium text-[#111111]">
                          Switch to {theme === 'dark' ? 'Light Studio' : 'Obsidian Dark'} Mode
                        </span>
                      </div>
                      <p className="text-xs text-[#555555]">
                        Toggle cohesive light &amp; dark architectural studio themes
                      </p>
                    </div>
                  </div>
                </Command.Item>
              </Command.Group>

              <Command.Group
                heading="Project Case Studies"
                className="mt-2 px-2 py-1.5 font-mono text-[11px] tracking-wider text-[#555555] uppercase"
              >
                {PROJECTS.map((project) => (
                  <Command.Item
                    key={project.slug}
                    value={`/projects/${project.slug} ${project.title} ${project.category}`}
                    onSelect={() => handleAction('route', `/projects/${project.slug}`)}
                    className="mt-1 flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left transition-colors aria-selected:bg-[#EEEEEE]"
                  >
                    <div className="flex items-center gap-3">
                      <FolderGit2 className="h-4 w-4 shrink-0 text-[#444444]" aria-hidden="true" />
                      <div>
                        <span className="text-sm font-medium text-[#111111]">{project.title}</span>
                        <span className="ml-2 font-mono text-[11px] text-[#555555]">
                          {project.category}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] font-semibold text-[#164CE0]">
                      {project.status}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            </Command.List>
          </Command>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
