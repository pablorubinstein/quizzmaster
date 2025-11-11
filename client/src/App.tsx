import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Review from "./pages/Review";
import Feedback from "./pages/Feedback";
import History from "./pages/History";
import Upload from "./pages/Upload";
import LanguageSwitcher from "@/components/LanguageSwitcher";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/quiz/:quizId" component={Quiz} />
      <Route path="/review/:attemptId/:quizId" component={Review} />
      <Route path="/feedback" component={Feedback} />
      <Route path="/history" component={History} />
      <Route path="/upload" component={Upload} />
      <Route path="/404" component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          {/* Add Language Switcher to Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h1 className="text-2xl font-bold">Quiz Master</h1>
            <LanguageSwitcher />
          </div>
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

