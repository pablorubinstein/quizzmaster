import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { getSessionId } from "@/lib/sessionManager";
import { useLocation } from "wouter";

export default function Home() {
  const [sessionId, setSessionId] = useState<string>("");
  const [, setLocation] = useLocation();

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  const { data: quizzes, isLoading } = trpc.quiz.listQuizzes.useQuery();
  const { data: stats } = trpc.quiz.getSessionStats.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Quiz Master</h1>
          <p className="text-lg text-gray-600">Test your knowledge with interactive quizzes</p>
        </div>

        {/* User Stats */}
        {stats && stats.totalAttempts > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Attempts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalAttempts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.averageScore}%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Quizzes Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.quizzes.length}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Available Quizzes */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Quizzes</h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-gray-200 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : quizzes && quizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((quiz) => (
                <Card
                  key={quiz.id}
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setLocation(`/quiz/${quiz.id}`)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    {quiz.description && (
                      <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">Start Quiz</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No quizzes available yet.</p>
              <Button onClick={() => setLocation("/upload")}>Upload a Quiz</Button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            variant="outline"
            onClick={() => setLocation("/upload")}
            className="px-6"
          >
            Upload Quiz
          </Button>
          <Button
            variant="outline"
            onClick={() => setLocation("/feedback")}
            className="px-6"
          >
            Send Feedback
          </Button>
          {stats && stats.totalAttempts > 0 && (
            <Button
              variant="outline"
              onClick={() => setLocation("/history")}
              className="px-6"
            >
              View History
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

