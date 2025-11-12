import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { getSessionId } from "@/lib/sessionManager";
import { useTranslation } from 'react-i18next';

export default function Review() {
  const { t, i18n } = useTranslation();
  const { attemptId, quizId } = useParams<{ attemptId: string; quizId: string }>();
  const [, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  const { data: answers, isLoading } = trpc.quiz.getAttemptDetails.useQuery(
    { attemptId: parseInt(attemptId || "0"), quizId: parseInt(quizId || "0") },
    { enabled: !!attemptId && !!quizId }
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
  const correctCount = answers.filter((a) => a.isCorrect).length;
  const percentage = Math.round((correctCount / answers.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Review</h1>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                You got {correctCount} out of {answers.length} questions correct ({percentage}%)
              </p>
              <div className="text-3xl font-bold text-blue-600">{percentage}%</div>
            </div>
          </div>

          {/* Missed Questions Section */}
          {missedQuestions.length > 0 && (
            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-bold text-gray-900">Questions to Review</h2>
              {missedQuestions.map((answer, index) => (
                <Card key={index} className="border-l-4 border-l-red-500">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Question {answer.questionIndex + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Original Question */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Question:</p>
                      <p className="text-gray-900 font-medium">{answer.question}</p>
                    </div>

                    {/* Options */}
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-2">Options:</p>
                      <div className="space-y-2">
                        {answer.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-2 rounded border ${
                              option === answer.correctAnswer
                                ? "bg-green-50 border-green-300"
                                : option === answer.selectedAnswer
                                  ? "bg-red-50 border-red-300"
                                  : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <p className="text-sm">
                              <span className="font-semibold">{String.fromCharCode(65 + optIndex)})</span> {option}
                              {option === answer.correctAnswer && (
                                <span className="ml-2 text-green-600 font-semibold">✓ Correct</span>
                              )}
                              {option === answer.selectedAnswer && option !== answer.correctAnswer && (
                                <span className="ml-2 text-red-600 font-semibold">✗ Your answer</span>
                              )}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Your Answer vs Correct Answer */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Your Answer:</p>
                        <p className="text-red-600 font-medium">{answer.selectedAnswer}</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-1">Correct Answer:</p>
                        <p className="text-green-600 font-medium">{answer.correctAnswer}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* All Answers Section */}
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
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Question {answer.questionIndex + 1}</CardTitle>
                    {answer.isCorrect && (
                      <span className="text-green-600 font-bold text-lg">✓</span>
                    )}
                    {!answer.isCorrect && (
                      <span className="text-red-600 font-bold text-lg">✗</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Original Question */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Question:</p>
                    <p className="text-gray-900 font-medium">{answer.question}</p>
                  </div>

                  {/* Options */}
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Options:</p>
                    <div className="space-y-2">
                      {answer.options.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`p-2 rounded border ${
                            option === answer.correctAnswer
                              ? "bg-green-50 border-green-300"
                              : option === answer.selectedAnswer && !answer.isCorrect
                                ? "bg-red-50 border-red-300"
                                : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <p className="text-sm">
                            <span className="font-semibold">{String.fromCharCode(65 + optIndex)})</span> {option}
                            {option === answer.correctAnswer && (
                              <span className="ml-2 text-green-600 font-semibold">✓ Correct</span>
                            )}
                            {option === answer.selectedAnswer && !answer.isCorrect && (
                              <span className="ml-2 text-red-600 font-semibold">✗ Your answer</span>
                            )}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Answer Summary */}
                  <div className="pt-2 border-t">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Your Answer:</p>
                    <p
                      className={`font-medium ${
                        answer.isCorrect ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {answer.selectedAnswer}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            {missedQuestions.length > 0 && (
              <Button
                onClick={() => setLocation(`/quiz/${quizId}`)}
                className="px-6"
              >
                {t('review.retakeQuiz')}
              </Button>
            )}
            <Button
              onClick={() => setLocation("/")}
              variant="outline"
              className="px-6"
            >
              {t('review.backToHome')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
