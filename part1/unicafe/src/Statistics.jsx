import StatisticLine from './StatisticLine'

const Statistics = ({ good, neutral, bad }) => {
  const total = good + neutral + bad
  const average = (good - bad) / total || 0
  const positivePercentage = (good / total) * 100 || 0

  if (total === 0) {
    return <p>No feedback given</p>
  }

  return (
    <div>
      <h1>Statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="all" value={total} />
          <StatisticLine text="average" value={average.toFixed(1)} />
          <StatisticLine text="positive" value={positivePercentage.toFixed(1) + ' %'} />
        </tbody>
      </table>
    </div>
  )
}

export default Statistics
