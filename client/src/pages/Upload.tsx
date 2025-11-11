import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { trpc } from "@/lib/trpc";
import { parseQuizFromText } from "@/lib/sessionManager";

export default function Upload() {
  const [, setLocation] = useLocation();
  const [quizContent, setQuizContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const uploadMutation = trpc.quiz.uploadQuiz.useMutation();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      const content = event.target?.result as string;
      setQuizContent(content);
      setError("");
    };

    reader.onerror = () => {
      setError("Failed to read file. Please try again.");
    };

    reader.readAsText(file);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    // Allow paste to work normally
    setTimeout(() => {
      setError("");
    }, 0);
  };

  const handleSubmit = async () => {
    if (!quizContent.trim()) {
      setError("Please provide quiz content");
      return;
    }

    // Parse the quiz content to validate format
    const parsedQuiz = parseQuizFromText(quizContent);
    if (!parsedQuiz) {
      setError(
        "Invalid quiz format. Please check the format and try again. Quiz must have a title and at least one question."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      await uploadMutation.mutateAsync({
        title: parsedQuiz.title,
        description: parsedQuiz.description || null,
        content: JSON.stringify(parsedQuiz),
      });

      setSuccess(true);
      setQuizContent("");
      setFileName("");

      // Redirect to home after 2 seconds
      setTimeout(() => {
        setLocation("/");
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload quiz. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-8">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto border-2 border-green-500">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="text-4xl">✓</div>
              <h2 className="text-2xl font-bold text-green-600">Quiz Uploaded!</h2>
              <p className="text-gray-600">Your quiz has been added successfully.</p>
              <p className="text-sm text-gray-500">Redirecting to home...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload a Quiz</h1>
            <p className="text-gray-600">
              Add a new quiz by uploading a text file or pasting quiz content
            </p>
          </div>

          {/* Upload Form */}
          <Card>
            <CardHeader>
              <CardTitle>Quiz Upload Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* File Upload */}
              <div>
                <Label htmlFor="file-upload" className="text-base font-semibold mb-2 block">
                  Upload File (Optional)
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".txt"
                    onChange={handleFileSelect}
                    className="flex-1"
                  />
                  {fileName && (
                    <span className="text-sm text-green-600 font-medium">{fileName}</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Supported format: .txt files
                </p>
              </div>

              {/* Quiz Content */}
              <div>
                <Label htmlFor="quiz-content" className="text-base font-semibold mb-2 block">
                  Quiz Content
                </Label>
                <Textarea
                  id="quiz-content"
                  placeholder={`Title: My Quiz
Description: A brief description
---
Q1: What is the capital of France?
A) London
B) Paris
C) Berlin
D) Madrid
Correct: B
---
Q2: Next question?
A) Option A
B) Option B
C) Option C
D) Option D
Correct: A`}
                  value={quizContent}
                  onChange={(e) => {
                    setQuizContent(e.target.value);
                    setError("");
                  }}
                  onPaste={handlePaste}
                  className="min-h-64 font-mono text-sm"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Use the format shown above. Questions must be separated by "---"
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Format Guide */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Quiz Format Guide</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Start with <code className="bg-white px-1 rounded">Title: Your Quiz Title</code></li>
                  <li>• Add <code className="bg-white px-1 rounded">Description: Optional</code></li>
                  <li>• Separate questions with <code className="bg-white px-1 rounded">---</code></li>
                  <li>• Each question: <code className="bg-white px-1 rounded">Q1: Question text?</code></li>
                  <li>• Options: <code className="bg-white px-1 rounded">A) Option</code>, <code className="bg-white px-1 rounded">B) Option</code>, etc.</li>
                  <li>• Mark correct answer: <code className="bg-white px-1 rounded">Correct: A</code></li>
                </ul>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleSubmit}
                  disabled={!quizContent.trim() || loading}
                  className="flex-1"
                >
                  {loading ? "Uploading..." : "Upload Quiz"}
                </Button>
                <Button
                  onClick={() => setLocation("/")}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
