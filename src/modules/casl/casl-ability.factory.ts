import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { UserPayloadDto } from '../authentication/dto/authenticatedUser.dto';
import { Answer } from '../questions/entities/answers.entity';
import { Question } from '../questions/entities/question.entity';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { Action } from './casl.action';

type Subjects =
  | InferSubjects<typeof Question | typeof Answer | typeof UpdateUserDto>
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserPayloadDto) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    // can(Action.Update, Question, { userId: user.userId });
    // can(Action.Update, Answer, { userId: user.userId });
    // can(Action.Delete, Question, { userId: user.userId });
    // can(Action.Delete, Answer, { userId: user.userId });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
