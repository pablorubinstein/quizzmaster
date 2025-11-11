import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { getSessionId } from "@/lib/sessionManager";

export default function Review() {
  const { attemptId } = useParams<{ attemptId: string }>();
  const [, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  const { data: answers, isLoading } = trpc.quiz.getAttemptDetails.useQuery(
    { attemptId: parseInt(attemptId || "0") },
    { enabled: !!attemptId }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading review...</p>
        </div>
      </div>
    );
  }

  if (!answers || answers.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Review not found</p>
          <Button onClick={() => setLocation("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const missedQuestions = answers.filter((a) => !a.isCorrect);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Review</h1>
            <p className="text-gray-600">
              You missed {missedQuestions.length} out of {answers.length} questions
            </p>
          </div>

          {/* Missed Questions */}
          {missedQuestions.length > 0 ? (
            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-bold text-gray-900">Questions to Review</h2>
              {missedQuestions.map((answer, index) => (
                <Card key={index} className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Question {answer.questionIndex + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">Your Answer:</p>
                      <p className="text-red-600 font-medium">{answer.selectedAnswer}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="mb-8 border-l-4 border-l-green-500">
              <CardContent className="pt-6">
                <p className="text-green-600 font-semibold text-center">
                  Perfect! You got all questions correct!
                </p>
              </CardContent>
            </Card>
          )}

          {/* Correct Answers */}
          <div className="space-y-4 mb-8">
            <h2 className="text-xl font-bold text-gray-900">All Answers</h2>
            {answers.map((answer, index) => (
              <Card
                key={index}
                className={`border-l-4 ${
                  answer.isCorrect ? "border-l-green-500" : "border-l-red-500"
                }`}
              >
                <CardHeader>
                  <CardTitle className="text-lg">Question {answer.questionIndex + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Your Answer:</p>
                    <p
                      className={`font-medium ${
                        answer.isCorrect ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {answer.selectedAnswer}
                    </p>
                  </div>
                  {answer.isCorrect && (
                    <div className="text-green-600 text-sm font-semibold">✓ Correct</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            {missedQuestions.length > 0 && (
              <Button
                onClick={() => setLocation("/")}
                className="px-6"
              >
                Retake Quiz
              </Button>
            )}
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

