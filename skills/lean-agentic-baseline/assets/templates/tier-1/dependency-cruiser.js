module.exports = {
  forbidden: [
    {
      name: 'routes-not-to-repos',
      comment: 'Routes call services. Only services call repos.',
      severity: 'error',
      from: { path: '^src/routes/' },
      to: { path: '^src/repos/' },
    },
    {
      name: 'repos-not-to-services',
      severity: 'error',
      from: { path: '^src/repos/' },
      to: { path: '^src/services/' },
    },
    { name: 'no-circular', severity: 'error', from: {}, to: { circular: true } },
  ],
}
