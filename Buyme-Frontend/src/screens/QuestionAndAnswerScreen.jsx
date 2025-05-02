import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Loader from '../components/Loader';
import { format } from 'date-fns';
import { FaUserCircle, FaUserTie } from 'react-icons/fa';

const QuestionAndAnswerScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [questions, setQuestions] = useState([]);
  const [questionText, setQuestionText] = useState('');
  const [loading, setLoading] = useState(false);
  console.log(userInfo)

  const sortedQuestions = [...questions].sort(
    (a, b) => new Date(b.asked_at) - new Date(a.asked_at)
  );

  const fetchUnansweredQuestions = async () => {
    try {
      const { data } = await axios.get('/api/question/all', {
        headers: { Authorization: `Bearer ${userInfo.data}` },
      });
      setQuestions(data?.data || []);
    } catch (err) {
      console.error('Failed to fetch questions', err);
    }
  };

  useEffect(() => {
    fetchUnansweredQuestions();
  }, []);

  const answerQuestion = async (id) => {
    const answer = prompt('Enter your answer:');
    if (!answer) return;
    try {
      await axios.post(
        `/api/question/answer/${id}`,
        { answer_text: answer },
        {
          headers: { Authorization: `Bearer ${userInfo.data}` },
        }
      );
      fetchUnansweredQuestions();
    } catch (err) {
      console.error('Error submitting answer:', err);
    }
  };

  const postQuestion = async () => {
    if (!questionText.trim()) return;
    try {
      await axios.post(
        '/api/question',
        {
          user_id: userInfo.user_id,
          question_text: questionText,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.data}` },
        }
      );
      setQuestionText('');
      fetchUnansweredQuestions();
    } catch (err) {
      console.error('Failed to post question:', err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Q & A Session</h1>

      <div className="mb-6">
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Ask your question..."
        ></textarea>
        <button
          onClick={postQuestion}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit Question
        </button>
      </div>

      <div className="space-y-6">
        {sortedQuestions.map((q) => (
          <div key={q.question_id} className="flex flex-col space-y-2">
            <div className="self-end bg-blue-100 px-4 py-3 rounded shadow w-fit max-w-[75%]">
            <p className="font-semibold text-gray-800">{q.question_text}</p>
              <div className="flex items-center mb-1">
                {/* <img src="https://placehold.co/32" alt="user" className="w-6 h-6 rounded-full mr-2" /> */}
                <FaUserCircle className="w-6 h-6 text-blue-500 mr-2" />
                <p className="text-xs text-gray-500 mt-1">Asked at: {format(new Date(q.asked_at), 'PPpp')}</p>
              </div>
            </div>

            {q.answer_text ? (
              <div className="self-start bg-green-100 px-4 py-3 rounded shadow w-fit max-w-[75%]">
                <p className="font-semibold text-gray-800">{q.answer_text}</p>
                <div className="flex items-center mb-1">
                  {/* <img src="https://placehold.co/32?text=CR" alt="rep" className="w-6 h-6 rounded-full mr-2" /> */}
                  <FaUserTie className="w-6 h-6 text-green-600 mr-2" />
                  <p className="text-xs text-gray-500 mt-1">Answered at: {format(new Date(q.answered_at), 'PPpp')}</p>
                </div>
              </div>
            ) : userInfo?.is_customer_repr === true ? (
                <div className="flex justify-end mt-1">
                  <button
                    onClick={() => answerQuestion(q.question_id)}
                    className="bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700"
                  >
                    Answer
                  </button>
                </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionAndAnswerScreen;
