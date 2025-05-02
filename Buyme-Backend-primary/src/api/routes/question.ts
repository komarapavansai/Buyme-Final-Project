import { Router, Request, Response } from 'express';
import { Container } from 'typedi';
import middlewares from '../middlewares';
import QuestionService from '../../services/questionService';

const route = Router();

export default (app: Router) => {
  app.use('/question', route);
  const questionService = Container.get(QuestionService);

  // User asks a question
  route.post('/', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = questionService.buildAskQuestionDto(req);
      const { data } = await questionService.askQuestion(dto);
      return res.json({ data });
    } catch (e) {
      return res.status(500).json({ error: `${e.message.toString()}` });
    }
  });

  // Rep answers a question
  route.post('/answer/:question_id', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const dto = questionService.buildReplyQuestionDto(req);
      const { data } = await questionService.answerQuestion(dto);
      return res.json({ data });
    } catch (e) {
      return res.status(500).json({ error: `${e.message.toString()}` });
    }
  });

  // Get all questions (answered + unanswered)
  route.get('/all', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const { data } = await questionService.getAllQuestions();
      return res.json({ data });
    } catch (e) {
      return res.status(500).json({ error: `${e.message.toString()}` });
    }
  });

  // Rep gets list of unanswered questions
  route.get('/unanswered', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const { data } = await questionService.getUnansweredQuestions(req.query.search?.toString() ?? "");
      return res.json({ data });
    } catch (e) {
      console.log(req)
      return res.status(500).json({ error: `${e.message.toString()}` });
    }
  });

  route.put('/:question_id/answer', middlewares.attachCurrentUser, async (req: Request, res: Response) => {
    try {
      const questionService = Container.get(QuestionService);
      const dto = questionService.buildReplyQuestionDto(req);
      const { data } = await questionService.answerQuestion(dto);
      return res.json({ data });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'Failed to reply to question.' });
    }
  });
};
