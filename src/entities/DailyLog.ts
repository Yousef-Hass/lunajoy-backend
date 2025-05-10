import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './User';

@Entity('daily_logs')
export class DailyLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column()
  mood: number;

  /** Self-assessed anxiety level (scale) */
  @Column({ type: 'int', nullable: true })
  anxietyLevel: number;

  /** Hours of sleep */
  @Column({ type: 'float', nullable: true })
  sleepHours: number;

  /** Quality of sleep (e.g., 'good', 'fair', 'poor') */
  @Column({ type: 'varchar', length: 50, nullable: true })
  sleepQuality: string;

  /** Any sleep disturbances */
  @Column({ type: 'text', nullable: true })
  sleepDisturbances: string;

  /** Type of physical activity */
  @Column({ type: 'varchar', length: 100, nullable: true })
  physicalActivityType: string;

  /** Duration of physical activity (minutes) */
  @Column({ type: 'int', nullable: true })
  physicalActivityDuration: number;

  /** Frequency of social interactions (per day) */
  @Column({ type: 'int', nullable: true })
  socialInteractions: number;

  /** Self-reported stress level (scale) */
  @Column({ type: 'int', nullable: true })
  stressLevel: number;

  /** Symptoms of depression (text/optional) */
  @Column({ type: 'text', nullable: true })
  depressionSymptoms: string;

  /** Symptoms of anxiety (text/optional) */
  @Column({ type: 'text', nullable: true })
  anxietySymptoms: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.dailyLogs)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
