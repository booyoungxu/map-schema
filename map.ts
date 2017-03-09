export enum Network {
    No = 0,
    Network2G = 1,
    Network25G = 2,
    Network3G = 3,
    Network4G = 4
}

// 手机信号的结构
export interface Signal {
    network: Network;
    strength: number;
}

// 几何结构
export namespace Shape {
    // 点信息
    export interface Point {
        // 涉及三种坐标体系，如下：
        // 经纬度，单位是度，地图数据
        lat?: number;
        lng?: number;
        // x、y为映射后的横纵坐标，单位是米，地图数据
        x?: number;
        y?: number;
        // lx，ly纵横坐标，单位是1/4096个tile宽度，仅在tile中存在
        lx?: number;
        ly?: number;

        alt?: number;
        signals?: {
            [index: string]: Signal
        }; // 运营商信号信息，key可以为'cm', 'cu', 'ct'，代表中国移动、中国联通、中国电信
    }

    export interface Line {
        points: Array<Point>;
        dist?: number;
        // IMPORTANT 爬升和下降分来计算，不抵消
        upDist?: number;
        downDist?: number;
    }

    export interface Area {
        points: Array<Point>;
        // IMPORTANT, 此处不用Type Area = Array<Point>，主要是考虑到Line之后可能还会有内容，例如面积等
    }
}

// 地理结构
export namespace Geo {
    export interface Metadata {
        //metadata
        label?: string; // 标签
        description?: string;
        sources?: Array<string>; // perfId列表，表示数据来源
        // TODO 是否需要标记是perf哪一段？暂时不标记
        contributors?: Array<string>; // userId列表，表示数据来源的贡献者
        detailId?: string; // detailId表示详细信息的数据库id
    }

    export interface Vertex extends Metadata {
        id: number;
        point: Shape.Point;
        area: Shape.Area;
        start_eids: Array<number>; // 连接在该顶点的边id列表，主要用于相互检查
        end_eids: Array<number>; // 连接在该顶点的边id列表，主要用于相互检查
    }

    export interface Edge extends Metadata {
        id: number;
        start_vid: number; // 起点、终点id
        end_vid: number;
        line: Shape.Line; // 边对应的几何图形为line数组, 主要因为切块后可能会在一个块内存在同一id下的多个line
    }

    export interface Map {
        version: number // 地图格式版本号
        updatedAt: Date // 最后更新日期
        vertexes: {
            [index: number]: Vertex
        }
        edges: {
            [index: number]: Edge
        }
    }
}

export namespace Internal {
    export type Areas = Array<Shape.Area>;
}
