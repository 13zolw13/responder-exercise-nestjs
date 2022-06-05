import { Answer } from '../entities/answers.entity';

describe('Answer entity', () => {
  it('should  be  defined', () => {
    const answer = new Answer();
    expect(answer).toBeTruthy();

    expect(answer.id).toBeUndefined();
    expect(answer.summary).toBeUndefined();
    expect(answer.author).toBeUndefined();
    expect(answer.question).toBeUndefined();
  });

  it('should be define and have property ', () => {
    const answer = new Answer();
    answer.summary = 'summary';
    answer.author = 'author';
    answer.questionId = 'questionId';
    expect(answer).toBeTruthy();
    expect(answer.id).toBeUndefined();
    expect(answer.summary).toBe('summary');
    expect(answer.author).toBe('author');
    expect(answer.questionId).toBe('questionId');
  });
});
