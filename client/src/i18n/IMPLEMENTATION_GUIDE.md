# React-i18next Integration Guide for Quiz Application

This guide explains how to integrate **react-i18next** into your quiz application for multi-language support.

## Installation

First, install the required dependencies:

```bash
npm install i18next react-i18next i18next-browser-languagedetector
# or
pnpm add i18next react-i18next i18next-browser-languagedetector
```

## Step 1: Initialize i18n in Your App

Update your `client/src/main.tsx` to import and initialize i18n:

```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n/config.ts'  // Import i18n configuration

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

## Step 2: Add Language Switcher to Your App

Update `client/src/App.tsx` to include the language switcher in your navigation:

```tsx
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Review from "./pages/Review";
import Feedback from "./pages/Feedback";
import History from "./pages/History";
import Upload from "./pages/Upload";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/quiz/:quizId"} component={Quiz} />
      <Route path={"/review/:attemptId/:quizId"} component={Review} />
      <Route path={"/feedback"} component={Feedback} />
      <Route path={"/history"} component={History} />
      <Route path={"/upload"} component={Upload} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
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
```

## Step 3: Use Translations in Components

### Basic Usage with `useTranslation` Hook

```tsx
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('home.title')}</h1>
      <p>{t('home.subtitle')}</p>
      <button>{t('common.submit')}</button>
    </div>
  );
}
```


