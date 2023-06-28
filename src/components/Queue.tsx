// A simple TypeScript Queue class

class Queue {
    items: any[];

    constructor(...params: any[]) {
        this.items = [...params];
    }

    public enqueue(item: any) {
        this.items.push(item);
    }

    public dequeue(): any {
        if (this.items.length > 0)
            return (this.items.shift());
        return null;
    }

    public size(): number {
        return this.items.length;
    }

    public clear(): void {
        this.items = [];
    }

    public top(): any {
        if (this.items.length > 0) {
            return this.items[0];
        }
        return null;
    }
    
    public print(): void {
        console.log(this.items)
    }

    public getAll(): any[] { 
        return (this.items)
    }

}

export default Queue;