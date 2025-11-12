import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { getSessionId, QuizAttemptAnswer } from "@/lib/sessionManager";
import { useTranslation } from "react-i18next";

export default function Quiz() {
  const { t } = useTranslation();
  const { quizId } = useParams<{ quizId: string }>();
  const [, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string>("");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<QuizAttemptAnswer[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  const { data: quiz, isLoading } = trpc.quiz.getQuiz.useQuery(
    { quizId: parseInt(quizId || "0") },
    { enabled: !!quizId }
  );

  const submitMutation = trpc.quiz.submitQuizAttempt.useMutation();

  const handleNext = () => {
    if (selectedAnswer) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = {
        questionIndex: currentQuestion,
        selectedAnswer,
      };
      setAnswers(newAnswers);

      if (currentQuestion < (quiz?.questions.length || 0) - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(newAnswers[currentQuestion + 1]?.selectedAnswer || "");
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = {
        questionIndex: currentQuestion,
        selectedAnswer,
      };
      setAnswers(newAnswers);

      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(newAnswers[currentQuestion - 1]?.selectedAnswer || "");
    }
  };

  const handleSubmit = async () => {
    if (selectedAnswer) {
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = {
        questionIndex: currentQuestion,
        selectedAnswer,
      };
      setAnswers(newAnswers);

      // Submit all answers
      await submitMutation.mutateAsync({
        sessionId,
        quizId: parseInt(quizId || "0"),
        answers: newAnswers,
      });

      setSubmitted(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t('quiz.loadingQuiz')}</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Quiz not found</p>
          <Button onClick={() => setLocation("/")}>Back to Home</Button>
        </div>
      </div>
    );
  }

  if (submitted && submitMutation.data) {
    const result = submitMutation.data;
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-green-500">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div>
                  <div className="text-5xl font-bold text-green-600 mb-2">
                    {result.percentage}%
                  </div>
                  <p className="text-xl text-gray-600">
                    You got {result.score} out of {result.totalQuestions} questions correct
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700">
                    {
                      result.percentage >= 80
                        ? "Excellent work! You've mastered this quiz."
                        : result.percentage >= 60
                          ? "Good job! Keep practicing to improve."
                          : "Keep trying! Review the missed questions and try again."
                    }
                  </p>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => setLocation(`/review/${result.attemptId}/${quizId}`)}
                    className="px-6"
                  >
                    {t('quiz.reviewAnswers')}
                  </Button>
                  <Button
                    onClick={() => setLocation("/")}
                    variant="outline"
                    className="px-6"
                  >
                    {t('quiz.backToHome')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">{question.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                height="200"
                width="200"
                src='https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/55/90/2e/55902ef3-485a-3d2c-d60c-33a9c765d038/AppIcon-0-0-1x_U007epad-0-1-85-220.png/400x400ia-75.webp'
              />

              <Separator></Separator>

              <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label
                        htmlFor={`option-${index}`}
                        className="flex-1 cursor-pointer p-2 rounded hover:bg-gray-100"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              variant="outline"
            >
              Previous
            </Button>

            {currentQuestion === quiz.questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={!selectedAnswer || submitMutation.isPending}
                className="px-8"
              >
                {submitMutation.isPending ? "Submitting..." : "Submit Quiz"}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!selectedAnswer}
                className="px-8"
              >
                Next
              </Button>
            )}
          </div>

          {submitMutation.error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
              {submitMutation.error.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

