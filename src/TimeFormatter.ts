export class TimeFormatter{

    public timeFormatter(seconds: number): string{

        let result = '';
        let timeinMinutes = 0;
        let timeInSeconds = 0;

        timeinMinutes = Math.floor(seconds/60);
        timeInSeconds = seconds%60;

        if(timeinMinutes<=0){
            result = `${timeInSeconds} s`;
        } else {
            result = `${timeinMinutes} m ${timeInSeconds} s`;
        }
        return result;

    }

}