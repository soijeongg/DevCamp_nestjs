import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Point } from '../entities';
import { createPointDto, applyPointDto } from '../dto';
import { user } from 'src/user/entities';

@Injectable()
export class PointRepository {
  constructor(private readonly entityManager: EntityManager) {}

  //들어가야 하는 것
  //1. 포인트 적립, 2. 포인트 사용(삭제) 3.해당 유저의 포인트확인

  async createPoint(dto: createPointDto): Promise<Point> {
    const findUser = await this.entityManager.findOne(user, {
      where: { userId: dto.userId },
    });
    if (!findUser) {
      throw new Error('유저를 찾지 못했습니다 ');
    }
    const point = new Point();
    point.point = dto.point;
    point.user = findUser;
    point.availableAmount = 5000;
    return this.entityManager.save(Point, point);
  }

  async deletePoint(dto: applyPointDto): Promise<Point> {
    //먼저 들어온 유저 아이디로 해당 유저의 포인트를 검색한 다음 그 사람의 포인트를 쓴 포인트 만큼 삭제한다
    const findPoint = await this.entityManager.findOne(Point, {
      where: { user: { userId: dto.userId } },
    });
    if (!findPoint) {
      throw new Error('포인트를 찾지 못했습니다.');
    }
    if (findPoint.availableAmount < dto.point) {
      throw new Error('사용할 포인트가 부족합니다.');
    }

    findPoint.availableAmount -= dto.point;
    await this.entityManager.save(Point, findPoint);
    return findPoint;
  }
  async getUserPoint(userId: number): Promise<Point> {
    const findPoint = await this.entityManager.findOne(Point, {
      where: { user: { userId: userId } },
    });

    if (!findPoint) {
      throw new Error('포인트를 찾지 못했습니다.');
    }
    return findPoint;
  }
}
