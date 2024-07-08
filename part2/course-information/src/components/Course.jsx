// src/components/Course.jsx
const Header = ({ course }) => <h1>{course.name}</h1>

const Part = ({ part }) => (
  <li>
    {part.name} {part.exercises}
  </li>
)

const Content = ({ parts }) => (
  <ul>
    {parts.map(part => (
      <Part key={part.id} part={part} />
    ))}
  </ul>
)

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)
  return <p>Total exercises: {total}</p>
}

const Course = ({ course }) => (
  <div>
    <Header course={course} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </div>
)

export default Course
