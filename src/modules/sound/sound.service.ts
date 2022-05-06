import prisma from "../../configs/db";
import { Sound, Prisma as PTypes } from "@prisma/client";
class SoundService {
  constructor() {}

  // Methods for get Sound information

  async getAll(args: PTypes.SoundFindManyArgs): Promise<Array<Sound>> {
    return prisma.sound.findMany(args);
  }

  async count(where: PTypes.SoundWhereInput): Promise<number> {
    return prisma.sound.count({ where });
  }

  async getById(id: number): Promise<Sound | null> {
    return prisma.sound.findUnique({
      where: { id_: id },
      include: { User_: true },
    });
  }

  async saveSound(
    soundId: number,
    audioLink: string | undefined,
    UserId: number
  ): Promise<PTypes.SoundCreateInput | null> {
    return prisma.sound.update({
      data: {
        isRecording: false,
        recorded: true,
        audioLink,
        User_: { connect: { id_: UserId } },
      },
      where: { id_: soundId },
    });
  }

  async getNewAudio(UserId: number): Promise<PTypes.SoundCreateInput | null> {
    //Get recording audio for this user
    let currentRecordsQuery = prisma.sound.findMany({
      where: { UserId_: UserId, isRecording: true },
      select: { id_: true },
    });

    //Get undesired sound
    let undesiredSoundsQuery = prisma.user.findUnique({
      where: { id_: UserId },
      select: { undesiredSounds_: true },
    });

    let [currentRecords, undesiredSounds] = await Promise.all([
      currentRecordsQuery,
      undesiredSoundsQuery,
    ]);

    currentRecords.forEach(obj => {
      undesiredSounds?.undesiredSounds_.push(obj.id_);
    });

    // Update undesiredSound for this user
    let userQuery = prisma.user.update({
      data: { undesiredSounds_: { set: undesiredSounds?.undesiredSounds_ } },
      where: { id_: UserId },
    });
    //Get new record for this user
    let newRecordQuery = prisma.sound.findFirst({
      where: {
        AND: {
          isRecording: false,
          recorded: false,
          id_: { notIn: undesiredSounds?.undesiredSounds_ },
        },
      },
    });
    //Free all audio recording by this user
    let freeUserRecords = prisma.sound.updateMany({
      data: { UserId_: null, isRecording: false },
      where: { UserId_: UserId, recorded: false, isRecording: true },
    });

    let [, newRecord] = await Promise.all([
      userQuery,
      newRecordQuery,
      freeUserRecords,
    ]);

    return prisma.sound.update({
      select: { id_: true, ref: true, fr: true, bci: true },
      data: { isRecording: true, User_: { connect: { id_: UserId } } },
      where: { id_: newRecord?.id_ },
    });
  }
}

export default SoundService;
