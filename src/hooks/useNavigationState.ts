
import { useLocation, useNavigate } from 'react-router-dom';

interface NavigationState {
  activeTab?: string;
  activeRiskTab?: string;
  activePlanningTab?: string;
  activeToolsTab?: string;
  sourceModule?: string;
  pageMode?: string;
}

interface NavigationStackItem {
  url: string;
  state: NavigationState;
}

export const useNavigationState = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navigateWithState = (path: string, currentState: NavigationState) => {
    // Get existing navigation stack from current location state
    const existingStack = (location.state as any)?.navigationStack || [];
    
    // Create new stack item for current location
    const currentStackItem: NavigationStackItem = {
      url: location.pathname,
      state: {
        activeTab: currentState.activeTab,
        activeRiskTab: currentState.activeRiskTab,
        activePlanningTab: currentState.activePlanningTab,
        activeToolsTab: currentState.activeToolsTab,
        sourceModule: currentState.sourceModule,
        pageMode: currentState.pageMode
      }
    };

    // Push current location to stack
    const newStack = [...existingStack, currentStackItem];

    console.log('[NavigationState] Navigating to:', path);
    console.log('[NavigationState] Navigation stack:', newStack);

    navigate(path, { 
      state: {
        ...currentState,
        navigationStack: newStack
      }
    });
  };

  const navigateBack = () => {
    const state = location.state as any;
    const navigationStack = state?.navigationStack || [];
    
    console.log('[NavigationState] Navigating back, current stack:', navigationStack);

    if (navigationStack.length > 0) {
      // Pop the last item from stack to get the previous location
      const previousItem = navigationStack[navigationStack.length - 1];
      const newStack = navigationStack.slice(0, -1);
      
      console.log('[NavigationState] Returning to:', previousItem.url);
      console.log('[NavigationState] New stack after pop:', newStack);

      // Navigate back to previous location with updated stack
      navigate(previousItem.url, { 
        state: {
          ...previousItem.state,
          navigationStack: newStack
        }
      });
    } else {
      // Fallback: if no stack, try to navigate to a sensible default
      console.log('[NavigationState] No navigation stack, using fallback');
      console.log('[NavigationState] Current location.state:', location.state);
      
      // If we're on a risk detail page, go back to risk tab
      if (location.pathname.includes('/risk-detail/')) {
        navigate('/new', { 
          state: {
            activeTab: 'risk',
            activeRiskTab: 'secondary-risk'
          }
        });
      } else {
        // 修复：当没有navigation stack时，尝试保持当前state或使用默认值导航回/new
        const currentState = location.state as any;
        console.log('[NavigationState] Fallback: attempting to preserve state:', currentState);
        
        navigate('/new', {
          state: {
            activeTab: currentState?.activeTab || 'discover',
            activeRiskTab: currentState?.activeRiskTab || 'main-risk', 
            activePlanningTab: currentState?.activePlanningTab || 'wealth-typing',
            activeToolsTab: currentState?.activeToolsTab || 'assessment',
            pageMode: currentState?.pageMode || 'member-severe-shortage',
            sourceModule: undefined // 清除sourceModule
          }
        });
      }
    }
  };

  const getReturnState = (): NavigationState | null => {
    return (location.state as NavigationState) || null;
  };

  const clearNavigationStack = () => {
    // Utility function to clear the stack if needed
    navigate(location.pathname, { 
      state: {
        ...(location.state as any),
        navigationStack: []
      },
      replace: true
    });
  };

  return {
    navigateWithState,
    navigateBack,
    getReturnState,
    clearNavigationStack
  };
};
