import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { getSessionId } from "@/lib/sessionManager";

export default function History() {
  const [, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  const { data: attempts, isLoading } = trpc.quiz.getSessionAttempts.useQuery(
    { sessionId },
    { enabled: !!sessionId }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz History</h1>
            <p className="text-gray-600">
              {attempts && attempts.length > 0
                ? `You have completed ${attempts.length} quiz${attempts.length !== 1 ? "zes" : ""}`
                : "You haven't completed any quizzes yet"}
            </p>
          </div>

          {/* Attempts List */}
          {attempts && attempts.length > 0 ? (
            <div className="space-y-4">
              {attempts.map((attempt, index) => (
                <Card key={attempt.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Attempt {attempts.length - index}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(attempt.completedAt).toLocaleDateString()} at{" "}
                          {new Date(attempt.completedAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">
                          {attempt.percentage}%
                        </div>
                        <p className="text-sm text-gray-600">
                          {attempt.score}/{attempt.totalQuestions}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => setLocation(`/review/${attempt.id}`)}
                      variant="outline"
                      className="w-full"
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-600 mb-4">No quiz attempts yet</p>
                <Button onClick={() => setLocation("/")}>Take a Quiz</Button>
              </CardContent>
            </Card>
          )}

          {/* Back Button */}
          <div className="mt-8 text-center">
            <Button
              onClick={() => setLocation("/")}
              variant="outline"
              className="px-6"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

