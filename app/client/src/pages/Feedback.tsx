import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { getSessionId } from "@/lib/sessionManager";

export default function Feedback() {
  const [, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string>("");
  const [feedbackType, setFeedbackType] = useState<"error" | "suggestion">("error");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSessionId(getSessionId());
  }, []);

  const { data: quizzes } = trpc.quiz.listQuizzes.useQuery();
  const submitMutation = trpc.quiz.submitFeedback.useMutation();

  const handleSubmit = async () => {
    if (!message.trim()) return;

    await submitMutation.mutateAsync({
      sessionId,
      type: feedbackType,
      message: message.trim(),
    });

    setSubmitted(true);
    setTimeout(() => {
      setLocation("/");
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto border-2 border-green-500">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="text-4xl">✓</div>
              <h2 className="text-2xl font-bold text-green-600">Thank You!</h2>
              <p className="text-gray-600">Your feedback has been submitted successfully.</p>
              <p className="text-sm text-gray-500">Redirecting to home...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Send Feedback</h1>
            <p className="text-gray-600">
              Help us improve by reporting errors or suggesting new quizzes
            </p>
          </div>

          {/* Feedback Form */}
          <Card>
            <CardHeader>
              <CardTitle>Feedback Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Feedback Type */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  What type of feedback?
                </Label>
                <RadioGroup value={feedbackType} onValueChange={(value: any) => setFeedbackType(value)}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="error" id="error" />
                    <Label htmlFor="error" className="cursor-pointer font-normal">
                      Report an error in a quiz
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="suggestion" id="suggestion" />
                    <Label htmlFor="suggestion" className="cursor-pointer font-normal">
                      Suggest a new quiz
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="message" className="text-base font-semibold mb-2 block">
                  {feedbackType === "error"
                    ? "Describe the error"
                    : "Describe the quiz you'd like to see"}
                </Label>
                <Textarea
                  id="message"
                  placeholder={
                    feedbackType === "error"
                      ? "e.g., Question 3 has an incorrect answer..."
                      : "e.g., A quiz about world capitals..."
                  }
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-32"
                />
                <p className="text-sm text-gray-500 mt-2">
                  {message.length}/1000 characters
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  onClick={handleSubmit}
                  disabled={!message.trim() || submitMutation.isPending}
                  className="flex-1"
                >
                  {submitMutation.isPending ? "Submitting..." : "Submit Feedback"}
                </Button>
                <Button
                  onClick={() => setLocation("/")}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>

              {submitMutation.error && (
                <div className="p-4 bg-red-100 text-red-700 rounded">
                  {submitMutation.error.message}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

