import { mock } from '@l2beat/common'
import { ProjectId, UnixTime } from '@l2beat/types'
import { expect } from 'earljs'

import { TransactionCounter } from '../../../src/core/activity/TransactionCounter'
import { SequenceProcessor } from '../../../src/core/SequenceProcessor'

const projectId = ProjectId('a')
const now = UnixTime.now()

describe(TransactionCounter.name, () => {
  describe(
    TransactionCounter.prototype.isSyncedUpToYesterdayInclusive.name,
    () => {
      it('returns false if no last timestamp', async () => {
        const counter = new TransactionCounter(
          projectId,
          mockProcessor(true),
          async () => undefined,
        )
        expect(await counter.isSyncedUpToYesterdayInclusive(now)).toEqual(false)
      })

      it('returns true if last is not today but processed all', async () => {
        const counter = new TransactionCounter(
          projectId,
          mockProcessor(true),
          async () => now.add(-1, 'days'),
        )
        expect(
          await counter.isSyncedUpToYesterdayInclusive(UnixTime.now()),
        ).toEqual(true)
      })

      it('returns true if last is today and not processed all', async () => {
        const counter = new TransactionCounter(
          projectId,
          mockProcessor(false),
          async () => now,
        )
        expect(
          await counter.isSyncedUpToYesterdayInclusive(UnixTime.now()),
        ).toEqual(true)
      })

      it('returns false if last is not today and not processed all', async () => {
        const counter = new TransactionCounter(
          projectId,
          mockProcessor(false),
          async () => now.add(-1, 'days'),
        )
        expect(
          await counter.isSyncedUpToYesterdayInclusive(UnixTime.now()),
        ).toEqual(false)
      })
    },
  )
})

function mockProcessor(hasProcessedAll: boolean) {
  return mock<SequenceProcessor>({ hasProcessedAll: () => hasProcessedAll })
}
