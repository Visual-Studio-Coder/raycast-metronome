# Event-based Timer/Metronome

## Documentation

[https://gibme-npm.github.io/timer/](https://gibme-npm.github.io/timer/)

## Sample Code

```typescript
import Timer from '@gibme/timer';

const timer = new Timer(60_000);

timer.on('tick', () => {
   // do something 
});

timer.start();
```
