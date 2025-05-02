import { Service } from 'typedi';
import { Request } from 'express';
import { Question } from '../models/questions';
import { col, fn, Op, where } from 'sequelize';


@Service()
export default class QuestionService {

  public buildAskQuestionDto(req: any) {
    return {
      user_id: req.claims.user_id,
      question_text: req.body.question_text,
    };
  }

  public async askQuestion(dto: { user_id: number, question_text: string }) {
    try {
      const question = await Question.create({
        user_id: dto.user_id,
        question_text: dto.question_text,
      });

      return { data: question };
    } catch (e) {
      throw new Error(`Failed to ask question: ${e.message}`);
    }
  }

  public buildReplyQuestionDto(req: any) {
    return {
      question_id: parseInt(req.params.question_id, 10),
      rep_id: req.claims!.user_id,
      answer_text: req.body.answer_text,
    };
  }

  public async answerQuestion(dto: { question_id: number, rep_id: number, answer_text: string }) {
    try {
      const question = await Question.findByPk(dto.question_id);

      if (!question) {
        throw new Error('Question not found');
      }

      question.rep_id = dto.rep_id;
      question.answer_text = dto.answer_text;
      question.answered_at = new Date();

      await question.save();

      return { data: question };
    } catch (e) {
      throw new Error(`Failed to answer question: ${e.message}`);
    }
  }

  public async getAllQuestions(): Promise<{ data: any }> {
    try {
      const allQuestions = await Question.findAll({
        order: [['asked_at', 'DESC']],
      });
      return { data: allQuestions };
    } catch (error) {
      throw new Error('Failed to fetch questions.');
    }
  }

  public async getUnansweredQuestions(param?: string) {
    try {
      const whereClause: any = {
        answer_text: null,
      };
  
      if (param) {
        whereClause[Op.and] = where(
          fn('LOWER', col('question_text')),
          {
            [Op.like]: `%${param.toLowerCase()}%`,
          }
        );
      }
  
      const questions = await Question.findAll({
        where: whereClause,
        order: [['asked_at', 'ASC']],
      });
  
      return { data: questions };
    } catch (e) {
      throw new Error(`Failed to retrieve unanswered questions: ${e.message}`);
    }
  }
}
